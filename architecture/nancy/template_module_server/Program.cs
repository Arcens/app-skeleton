namespace {{ AppName }}
{
    using System;
    using System.Configuration;
    using Nancy.Hosting.Self;

    class Program
    {
        static void Main(string[] args)
        {
            var uri = new Uri(string.Format("{0}:{1}/", ConfigurationManager.AppSettings["Host"], ConfigurationManager.AppSettings["Port"]));

            using (var host = new NancyHost(new HostConfiguration
            {
                UrlReservations = new UrlReservations() { CreateAutomatically = true }
            }, uri))
            {
                host.Start();

                Console.WriteLine(string.Format("{0} is running on {1}", ConfigurationManager.AppSettings["ServerName"], uri));
                Console.WriteLine("Press any [Enter] to close the host.");
                Console.ReadLine();
            }
        }
    }
}
