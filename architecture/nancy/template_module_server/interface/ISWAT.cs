using Nancy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace {{ AppName }}.Interfaces
{
    public interface ISWAT
    {
        Response All(dynamic parameters);

        Response Update(dynamic parameters);

        Response Create(dynamic parameters);

        Response Delete(dynamic parameters);

        Response FindById(dynamic parameters);

        Response Count(dynamic parameters);
    }
}
