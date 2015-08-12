using System;
using System.Collections.Generic;
using System.Web;
using System.Text;
using System.Configuration;
using System.IO;
using System.Collections;

namespace PORTALTV_OIPFUI
{
    /// <summary>
    /// Summary description for MB100AppCacheManifest
    /// </summary>
    public class MB100AppCacheManifest : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {

            var builder = new StringBuilder();
            const string path = @"C:\Users\gultekinm\Desktop\RÖNESANS\PORTAL_TVUI\PORTALTV_OIPFUI\PORTALTV_OIPFUI\";
            #region css-js
            builder.Append(@"CACHE MANIFEST
# version " + ConfigurationManager.AppSettings["CacheVersion"] +
@"

CACHE:
# A list of explicit URLs to request and store" + "\n");


            builder.Append("#Css" + "\n");

            var dirCss = new DirectoryInfo(path + @"css");
            FileInfo[] filesCss = dirCss.GetFiles();

            foreach (FileInfo file2 in filesCss)
            {
                if (file2.Extension == ".css")
                {
                    builder.AppendLine(@"css/" + file2.Name);
                }
            }


            var dirFonts = new DirectoryInfo(path + @"css\fonts");
            FileInfo[] filesFonts = dirFonts.GetFiles();

            foreach (FileInfo file2 in filesFonts)
            {
                if (file2.Extension == ".ttf")
                {
                    builder.AppendLine(@"css/fonts/" + file2.Name);
                }
            }


            builder.Append("#Js" + "\n");

            //Javascript Files

            var dirJs = new DirectoryInfo(path + @"script");
            FileInfo[] filesJs = dirJs.GetFiles();

            foreach (FileInfo file2 in filesJs)
            {
                if (file2.Extension == ".js")
                {
                    builder.AppendLine(@"script/" + file2.Name);
                }
            }


            builder.AppendLine();
            #endregion

            //var gm = new GalleryManager();

            //var cm = new CategoryManager(false);

            //List<PortalApplication> apps = gm.GetApplications();

            //var bm = new ServiceManager();

            //builder.AppendLine("# Images");

            //#region Images

            //foreach (PortalApplication app in apps)
            //{
            //    builder.AppendLine("/" + app.logo_url);
            //}

            //builder.AppendLine();

            //var pm = new PortalManager(false); //arda

            //builder.AppendLine(pm.GetTVuserBackgroundOptions().name);    //arda

            //foreach (NewUIAdvertisement ad in pm.FindActiveAdvertisements()) //arda
            //{
            //    builder.AppendLine(ad.imageUrl);
            //}


            //var dir = new DirectoryInfo(path + @"advgallery_mb100\images");    //Yigit
            //FileInfo[] files = dir.GetFiles();

            //foreach (FileInfo file2 in files)
            //{
            //    if (file2.Extension == ".jpg" || file2.Extension == ".jpeg" || file2.Extension == ".gif" || file2.Extension == ".png" || file2.Extension == ".gif")
            //    {
            //        builder.AppendLine(@"/advgallery_mb100/images/" + file2.Name);
            //    }
            //}

            //builder.AppendLine();
            //#endregion

            string[] lines = builder.ToString().Split(new string[] { Environment.NewLine }, StringSplitOptions.None);

            foreach (string line in lines)
            {
                if (line.StartsWith("/"))
                {
                    builder.AppendLine("/Auth.aspx?ReturnUrl=" + HttpUtility.UrlEncode(line));
                }
            }

            builder.AppendLine();

            builder.Append(@"NETWORK:
*
# Which resources are available only while online
# * meaning all resources that are not cached will require a connection.

FALLBACK:
# What to do when an offline user attempts to access an uncached file

# / Matching all resources
/ /allow/offline.html");

            context.Response.ContentType = "text/cache-manifest";
            context.Response.Write(builder);
        }

        private string MapPath(string p)
        {
            throw new NotImplementedException();
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}
