using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ModawantyBLL.IService;
using ModawantyDAL.Data;
using ModawantyDAL.Models;
using ModawantyDAL.RequestDto;
using ModawantyDAL.ResponseDto;

namespace ModawantyBLL.Service
{
    public class TagService : ITagService
    {
        private readonly ApplicationDbContext _context;

        public TagService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<List<TagResponse>>> GetAllTagsAsync(CancellationToken cancellationToken)
        {
            var tags = await _context.Tags
                 .AsNoTracking()
                 .Select(t => new TagResponse
                 {
                     Id = t.Id,
                     Name = t.Name,
                     IsAvailable = t.IsAvailable
                 })
                 .ToListAsync(cancellationToken);

            return Result<List<TagResponse>>.Success(200, tags);
        }

        public async Task<Result<bool>> AddTagAsync(TagRequest tagRequest, CancellationToken cancellationToken)
        {
            var tagExists = await _context.Tags
                .AnyAsync(c => c.Name.ToLower() == tagRequest.Name
                .Trim()
                .ToLower()
                , cancellationToken);

            if (tagExists)
                return Result<bool>.Fail(StatusCodes.Status400BadRequest, new[] { "Tag already exists" });

            var tag = new Tag
            {
                Name = tagRequest.Name.Trim(),
                IsAvailable = tagRequest.IsAvailable
            };

            await _context.Tags.AddAsync(tag, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(StatusCodes.Status201Created, true);
        }
        public async Task<Result<bool>> UpdateTagAsync(TagRequest tagRequest, CancellationToken cancellationToken)
        {
            var tag = await _context.Tags.FindAsync(tagRequest.Id);

            if (tag == null)
                return Result<bool>.Fail(StatusCodes.Status404NotFound, new[] { "Tag not found" });

            var tagExists = await _context.Tags
                .AnyAsync(c => c.Name.ToLower() == tagRequest.Name
                .Trim()
                .ToLower() && c.Id != tagRequest.Id, cancellationToken);

            if (tagExists)
                return Result<bool>.Fail(StatusCodes.Status400BadRequest, new[] { "Tag already exists" });

            tag.Name = tagRequest.Name.Trim();
            tag.IsAvailable = tagRequest.IsAvailable;

            _context.Update(tag);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(StatusCodes.Status200OK, true);
        }
        public async Task<Result<bool>> ToggleTagAsync(int Id, CancellationToken cancellationToken)
        {
            var Tag = await _context.Tags.FindAsync(Id);

            if (Tag == null)
                return Result<bool>.Fail(StatusCodes.Status404NotFound, new[] { "Tag not found" });

            Tag.IsAvailable = !Tag.IsAvailable;

            _context.Tags.Update(Tag);
            await _context.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(StatusCodes.Status200OK, true);
        }

    }
}
