using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Contracts
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        Task AddAsync(TEntity entity);
        void Update(TEntity entity);
        void Remove(TEntity entity);
        Task<TEntity?> GetByIdAsync(int Id);
        Task<IEnumerable<TEntity>> GetAllAsync();

        #region With specification
        Task<TEntity?> GetByIdAsync(ISpecifications<TEntity> specifications);
        Task<IEnumerable<TEntity>> GetAllAsync(ISpecifications<TEntity> specifications);
        Task<int> CountAsync(ISpecifications<TEntity> specifications);
        #endregion
    }
}
