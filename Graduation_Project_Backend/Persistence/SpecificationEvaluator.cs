using DomainLayer.Contracts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence
{
    static class SpecificationEvaluator
    {
        // Create Query
        // _dbContext.Products.where(p=>p.Id==id).Include(p=>p.PRoductBrand) .INclude(P=>p.ProductType);
        public static IQueryable<TEntity> CreateQuery<TEntity>(IQueryable<TEntity> InputQuery, ISpecifications<TEntity> specifications) where TEntity : class
        {
            var Query = InputQuery;
            if (specifications.Criteria is not null)
            {
                Query = Query.Where(specifications.Criteria);
            }


            if (specifications.OrderBy is not null)
            {
                Query = Query.OrderBy(specifications.OrderBy);
            }

            if (specifications.OrderByDescending is not null)
            {
                Query = Query.OrderByDescending(specifications.OrderByDescending);
            }



            if (specifications.IncludeExpressions is not null && specifications.IncludeExpressions.Count > 0)
            {
                Query = specifications.IncludeExpressions.Aggregate(Query, (CurrentQuery, IncludeExp) => CurrentQuery.Include(IncludeExp));
            }


            if (specifications.IsPaginated)
            {
                Query = Query.Skip(specifications.Skip).Take(specifications.Take);
            }
            return Query;
        }
    }
}
