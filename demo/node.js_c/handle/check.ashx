<%@ WebHandler Language="C#" Class="GenericHandler1" %>

using System;
using System.Web;
using System.IO;

public class GenericHandler1 : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "application/json";

        #region ==接收表单==
        string filename = ConvertString(context.Request.Form["filename"]);
        long totalSize = ConvertInt64(context.Request.Form["totalSize"], 0);
        #endregion

        string dir_temp = string.Format(
            "/UploadFile/temp/{0}_{1}",
            filename,
            totalSize
        );

        string[] filePaths;
        try
        {
            filePaths = Directory.GetFiles(context.Server.MapPath(dir_temp));
        }
        catch
        {
            filePaths = new string[0];
        }

        context.Response.Write(string.Format(
            "{{\"count\":\"{0}\"}}",
            filePaths.Length.ToString()
        ));
        context.Response.End();
    }

    public bool IsReusable
    {
        get
        {
            return false;
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

}