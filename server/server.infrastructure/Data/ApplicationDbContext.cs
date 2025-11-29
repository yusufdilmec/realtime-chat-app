using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using server.server.domain.Entities;
namespace server.server.infrastructure.Data
{


    public class ApplicationDbContext : IdentityDbContext<User>
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasKey(e => e.Id);




                entity.HasOne(e => e.Sender)
                      .WithMany(u => u.MessageSent)
                      .HasForeignKey(e => e.SenderId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Receiver)
                      .WithMany(u => u.MessageReceived)
                      .HasForeignKey(e => e.ReceiverId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

        }
    }
}
