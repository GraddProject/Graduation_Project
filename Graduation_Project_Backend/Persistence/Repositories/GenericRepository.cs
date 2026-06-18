using DomainLayer.Contracts;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Repositories
{
    public class GenericRepository<TEntity>(StoreIdentityDbContext _dbContext) : IGenericRepository<TEntity> where TEntity : class
    {
        public async Task AddAsync(TEntity entity) => await _dbContext.Set<TEntity>().AddAsync(entity);

        public async Task<IEnumerable<TEntity>> GetAllAsync() => await _dbContext.Set<TEntity>().ToListAsync();



        public async Task<TEntity?> GetByIdAsync(int Id) => await _dbContext.Set<TEntity>().FindAsync(Id);


        public void Remove(TEntity entity) => _dbContext.Set<TEntity>().Remove(entity);

        public void Update(TEntity entity) => _dbContext.Set<TEntity>().Update(entity);




        #region With Specification
        public async Task<IEnumerable<TEntity>> GetAllAsync(ISpecifications<TEntity> specifications)
        {
            return await SpecificationEvaluator.CreateQuery(_dbContext.Set<TEntity>(), specifications).ToListAsync();
        }


        public async Task<TEntity?> GetByIdAsync(ISpecifications<TEntity> specifications)
        {
            return await SpecificationEvaluator.CreateQuery(_dbContext.Set<TEntity>(), specifications).FirstOrDefaultAsync();
        }

        public async Task<int> CountAsync(ISpecifications<TEntity> specifications)
        {
            return await SpecificationEvaluator.CreateQuery(_dbContext.Set<TEntity>(), specifications).CountAsync();
        }
        #endregion
    }
}
