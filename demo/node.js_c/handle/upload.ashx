<%@ WebHandler Language="C#" Class="handle_upload" %>

using System;
using System.Web;
using System.IO;

public class handle_upload : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "application/json";

        #region ==接收表单==
        HttpFileCollection files = context.Request.Files;
        string filename = ConvertString(context.Request.Form["filename"]);
        int count = ConvertInt32(context.Request.Form["count"], 1);
        int index = ConvertInt32(context.Request.Form["index"], 1);
        long totalSize = ConvertInt64(context.Request.Form["totalSize"], 0);
        #endregion

        string dir_temp = "/UploadFile/temp";
        string filePath = dir_temp.Replace("/temp", "/") + createFileName(filename);

        if (count <= 1) // 文件没分片
        {
            files[0].SaveAs(context.Server.MapPath(filePath));
        }
        else // 分片了
        {
            // 获得临时目录
            string dir_temp_split = string.Format(
                "{0}/{1}_{2}",
                dir_temp,
                filename,
                totalSize.ToString()
            );

            // 临时目录不存在则创建
            if (!Directory.Exists(context.Server.MapPath(dir_temp_split)))
                Directory.CreateDirectory(context.Server.MapPath(dir_temp_split));

            // 保存文件到临时目录
            files[0].SaveAs(context.Server.MapPath(string.Format(
                "{0}/{1}",
                dir_temp_split,
                index.ToString()
            )));

            #region ==如果是最后一片，则合并文件==
            if (index >= count)
            {
                int i = 1;
                FileStream fs_read;
                BinaryReader binary_reader;
                FileStream fs_write = new FileStream(context.Server.MapPath(filePath), FileMode.Create);
                for (; i <= count; i++)
                {
                    fs_read = new FileStream(context.Server.MapPath(string.Format(
                        "{0}/{1}",
                        dir_temp_split,
                        i.ToString()
                    )), FileMode.Open);
                    binary_reader = new BinaryReader(fs_read);
                    fs_write.Write(binary_reader.ReadBytes((int)fs_read.Length), 0, (int)fs_read.Length);
                    fs_read.Close();
                    binary_reader.Close();
                }
                fs_write.Flush();
                fs_write.Close();

                #region ==删除临时文件夹==
                Directory.Delete(context.Server.MapPath(dir_temp_split), true);
                #endregion
            }
            #endregion
        }

        //context.Response.Write("success");
        context.Response.Write(string.Format("{{\"filePath\":\"{0}\"}}", filePath));
        context.Response.End();
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

    #region ==生成文件名==
    private static string createFileName(string _name)
    {
        return DateTime.Now.ToString("yyyyMMddHHmmss") + createRandomStr(6, 1) + "_" + _name;
    }
    #endregion

    #region ==生成随机码==
    /// <summary>
    /// 生成随机码。返回字符串
    /// </summary>
    /// <param name="n">位数，数字+字母的组合时请键入偶数</param>
    /// <param name="Kind">生成种类。1-纯数字 2-纯大写字母 3-纯小写字母 4-数字+大写字母 5-数字+小写字母 6-大写字母或小写字母 7-数字+纯大写字母或小写字母</param>
    public static string createRandomStr(int n, int Kind)
    {
        Random r = new Random();
        string code = "";
        int a = 0;
        switch (Kind)
        {
            case 1:
                for (int i = 0; i < n; i++)
                    code += r.Next(1, 10).ToString();
                break;
            case 2:
                for (int i = 0; i < n; i++)
                {
                    code += ((char)r.Next(65, 91)).ToString();
                }
                break;
            case 3:
                for (int i = 0; i < n; i++)
                {
                    code += ((char)r.Next(97, 123)).ToString();
                }
                break;
            case 4:
                for (int i = 0; i < n / 2; i++)
                {
                    code += r.Next(1, 10).ToString() + ((char)r.Next(65, 91)).ToString();
                }
                break;
            case 5:
                for (int i = 0; i < n / 2; i++)
                {
                    code += r.Next(1, 10).ToString() + ((char)r.Next(97, 123)).ToString();
                }
                break;
            case 6:
                for (int i = 0; i < n; i++)
                {
                    a = r.Next(65, 123);
                    if (a > 90 && a < 97)
                    {
                        i--;
                        continue;
                    }
                    code += ((char)a).ToString();
                }
                break;
            case 7:
                for (int i = 0; i < n / 2; i++)
                {
                    a = r.Next(65, 123);
                    if (a > 90 && a < 97)
                    {
                        i--;
                        continue;
                    }
                    code += r.Next(1, 10).ToString() + ((char)a).ToString();
                }
                break;
        }
        return code;
    }
    #endregion

    #region ==各种Convert==
    /// <summary>
    /// 转换变量为Int64
    /// </summary>
    /// <param name="str">object</param>
    public static long ConvertInt64(object str)
    {
        return ConvertInt64(str, 0);
    }
    /// <summary>
    /// 转换变量为Int64
    /// </summary>
    /// <param name="str">object</param>
    /// <param name="i">catch返值</param>
    public static long ConvertInt64(object str, int i)
    {
        try
        {
            return Convert.ToInt64(str);
        }
        catch
        {
            return i;
        }
    }
    /// <summary>
    /// 转换变量为Int32
    /// </summary>
    /// <param name="str">object</param>
    public static int ConvertInt32(object str)
    {
        return ConvertInt32(str, 0);
    }
    /// <summary>
    /// 转换变量为Int32
    /// </summary>
    /// <param name="str">object</param>
    /// <param name="i">catch返值</param>
    public static int ConvertInt32(object str, int i)
    {
        try
        {
            return Convert.ToInt32(str + "");
        }
        catch
        {
            return i;
        }
    }
    /// <summary>
    /// 转换变量为Int16
    /// </summary>
    /// <param name="str">object</param>
    public static int ConvertInt16(object str)
    {
        return ConvertInt16(str, 0);
    }
    /// <summary>
    /// 转换变量为Int16
    /// </summary>
    /// <param name="str">object</param>
    /// <param name="i">catch返值</param>
    public static int ConvertInt16(object str, int i)
    {
        try
        {
            return Convert.ToInt16(str);
        }
        catch
        {
            return i;
        }
    }
    /// <summary>
    /// 转换变量为Single
    /// </summary>
    /// <param name="str">object</param>
    public static float ConvertSingle(object str)
    {
        return ConvertSingle(str, 0);
    }
    /// <summary>
    /// 转换变量为Single
    /// </summary>
    /// <param name="str">object</param>
    /// <param name="i">catch返值</param>
    public static float ConvertSingle(object str, int i)
    {
        try
        {
            return Convert.ToSingle(str);
        }
        catch
        {
            return i;
        }
    }
    /// <summary>
    /// 转换变量为DateTime
    /// </summary>
    /// <param name="str">object</param>
    public static DateTime ConvertDateTime(object str)
    {
        return ConvertDateTime(str, DateTime.Now);
    }
    /// <summary>
    /// 转换变量为DateTime
    /// </summary>
    /// <param name="str">object</param>
    /// <param name="i">catch返值</param>
    public static DateTime ConvertDateTime(object str, DateTime i)
    {
        try
        {
            return Convert.ToDateTime(str);
        }
        catch
        {
            return i;
        }
    }
    /// <summary>
    /// 转换变量为Decimal
    /// </summary>
    /// <param name="str">object</param>
    public static Decimal ConvertDecimal(object str)
    {
        return ConvertDecimal(str, 0);
    }
    /// <summary>
    /// 转换变量为Decimal
    /// </summary>
    /// <param name="str">object</param>
    /// <param name="i">catch返值</param>
    public static Decimal ConvertDecimal(object str, Decimal i)
    {
        try
        {
            return Convert.ToDecimal(str);
        }
        catch
        {
            return i;
        }
    }
    /// <summary>
    /// 转换变量为String
    /// </summary>
    /// <param name="str">object</param>
    public static string ConvertString(object str)
    {
        return ConvertString(str, "");
    }
    /// <summary>
    /// 转换变量为String
    /// </summary>
    /// <param name="str">object</param>
    /// <param name="i">catch返值</param>
    public static string ConvertString(object str, string s)
    {
        try
        {
            return str.ToString();
        }
        catch
        {
            return s;
        }
    }
    #endregion

}