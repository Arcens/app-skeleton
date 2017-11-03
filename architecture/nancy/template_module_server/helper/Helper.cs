using Nancy;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace {{ AppName }}.Helpers
{
    public static class Helper
    {
        public static Response QueryHelper<T>(string Query = "", string httpVerb = "GET", dynamic payload = null, bool getOneElement = false) where T : class
        {
            try
            {
                using (var db = new PetaPoco.Database("SWATDB"))
                {

                    if(httpVerb == "GET")
                    {
                        if(!getOneElement)
                        {
                            var elements = db.Query<T>(Query).ToList();
                            return ResponseHelper(ResponseContent: elements, Verb: httpVerb);
                        }
                        else
                        {
                            var elements = db.FirstOrDefault<T>(Query);
                            return ResponseHelper(ResponseContent: elements, Verb: httpVerb);
                        }
                    }

                    if (httpVerb == "DELETE")
                    {
                        var elements = db.Execute(Query);
                        return ResponseHelper(ResponseCode: HttpStatusCode.OK, Verb: httpVerb);
                    }

                    if (httpVerb == "POST" && payload != null)
                    {
                        var element = db.Insert(payload);
                        return ResponseHelper(ResponseContent: element, Verb: httpVerb);
                    }

                    if (httpVerb == "PUT" && payload != null)
                    {
                        db.Save(payload);
                        return ResponseHelper(Verb: httpVerb);
                    }                

                    return null;
                }
            }
            catch (Exception ex)
            {
                ConsoleMessage(httpVerb, string.Format("Error in {0} Query", typeof(T).GetType()),  ex.Message);
                return HttpStatusCode.InternalServerError;
            }
        }      

        public static Response ResponseHelper(HttpStatusCode ResponseCode = HttpStatusCode.OK, object ResponseContent = null, string ResponsePhrase = "", string Verb = "GET")
        {
            Response r = null;

            if (ResponseCode == HttpStatusCode.OK && ResponseContent != null)
            {
                r = (Response)JsonConvert.SerializeObject(ResponseContent, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    });
                r.ContentType = "application/json";
                r.StatusCode = HttpStatusCode.OK;
            }
            else
            {
                r = new Response();
                r.ReasonPhrase = ResponsePhrase;
                r.StatusCode = ResponseCode;
            }

            string phrase = !string.IsNullOrEmpty(ResponsePhrase) ? string.Format("// Response Phrase : {0}", ResponsePhrase) : "";

            //Log to Console
            ConsoleMessage(Message: string.Format("Response status code : {0} {1}", r.StatusCode, phrase), Verb: Verb);

            return r;
        }

        public static void ConsoleMessage(string Verb = "GET", [CallerMemberName]string Message = "", string errorMessage = "")
        {
            if (!string.IsNullOrEmpty(errorMessage))
            {
                Console.ForegroundColor = ConsoleColor.Red;

                var message = new StringBuilder();
                message.Append("NOK - ");
                message.Append(Verb);
                message.Append(" - ");
                message.Append(Message);
                message.Append(" - Error Message : ");
                message.Append(errorMessage);
                Console.WriteLine(message.ToString());

                Console.ForegroundColor = ConsoleColor.White;
            }
            else
            {
                Console.ForegroundColor = ConsoleColor.Green;

                var message = new StringBuilder();
                message.Append("OK - ");
                message.Append(Verb);
                message.Append(" - ");
                message.Append(Message);
                Console.WriteLine(message.ToString());

                Console.ForegroundColor = ConsoleColor.White;
            }
        }
    }
}