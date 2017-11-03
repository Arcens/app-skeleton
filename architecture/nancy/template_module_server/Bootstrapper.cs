namespace {{ AppName }}
{
    using Helpers;
    using Nancy;
    using Nancy.Authentication.Stateless;
    using System;

    public class Bootstrapper : DefaultNancyBootstrapper
    {
        protected override void RequestStartup(Nancy.TinyIoc.TinyIoCContainer container, Nancy.Bootstrapper.IPipelines pipelines, NancyContext context)
        {

            var configuration = 
                new StatelessAuthenticationConfiguration(nancyContext =>
                {
                    //for now, we will pull the apiKey from the querystring,
                    //but you can pull it from any part of the NancyContext
                    var token = (string)nancyContext.Request.Headers.Authorization; 
                    
                    //get the user identity however you choose to (for now, using a static class/method)
                    return AuthHelper.GetUserFromToken(token);
                });

            StatelessAuthentication.Enable(pipelines, configuration);

            //CORS Enable
            pipelines.AfterRequest.AddItemToEndOfPipeline((ctx) =>
            {
                ctx.Response.WithHeader("Access-Control-Allow-Origin", "*")
                                .WithHeader("Access-Control-Allow-Methods", "POST,GET,PUT, DELETE, OPTION")
                                .WithHeader("Allow-Methods", "POST, GET, PUT, DELETE, OPTION")
                                .WithHeader("Access-Control-Allow-Credentials", "true")
                                .WithHeader("Access-Control-Allow-Headers", "Accept, Authorization, Origin, Content-type, X-File-Last-Modified, X-File-Name, X-File-Size");

            });

            pipelines.OnError.AddItemToEndOfPipeline((ctx, exc) =>
            {
                Console.WriteLine(exc.Message);
                return null;
            });
        }
    }
}