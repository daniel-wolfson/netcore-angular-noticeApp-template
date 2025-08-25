using Microsoft.AspNetCore.Mvc;
using NoticeAPI.Interfaces;
using NoticeAPI.Models;
using Swashbuckle.AspNetCore.Annotations;

namespace NoticeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class NoticesController(INoticeDataService noticeService, ILogger<NoticesController> logger) : ControllerBase
    {
        private readonly INoticeDataService _noticeService = noticeService;
        private readonly ILogger<NoticesController> _logger = logger;

        /// <summary>
        /// Get all notices
        /// </summary>
        /// <returns>List of all notices</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [SwaggerOperation(Summary = "Get all notices", Description = "Returns a list of all notices.")]
        public async Task<ActionResult<List<Notice>>> GetAllNotices()
        {
            try
            {
                var notices = await _noticeService.GetAllNoticesAsync();
                return Ok(notices);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all notices");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get a notice by ID
        /// </summary>
        /// <param name="id">Notice ID</param>
        /// <returns>The notice if found</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [SwaggerOperation(Summary = "Get a notice by ID", Description = "Returns a notice by ID.")]
        public async Task<ActionResult<Notice>> GetNotice(Guid id)
        {
            try
            {
                var notice = await _noticeService.GetNoticeByIdAsync(id);
                if (notice == null)
                {
                    return NotFound($"Notice with ID {id} not found");
                }

                return Ok(notice);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting notice {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Create a new notice
        /// </summary>
        /// <param name="notice">Notice to create</param>
        /// <returns>The created notice</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [SwaggerOperation(Summary = "Create a new notice", Description = "Returns a new notice.")]
        public async Task<ActionResult<Notice>> CreateNotice([FromBody] NoticeData notice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdNotice = await _noticeService.AddNoticeAsync(notice);
            if (createdNotice == null)
            {
                return StatusCode(500, $"Internal server error");
            }

            return Created(nameof(GetNotice), createdNotice);
        }

        /// <summary>
        /// Update an existing notice
        /// </summary>
        /// <param name="id">Notice ID</param>
        /// <param name="notice">Updated notice data</param>
        /// <returns>The updated notice</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [SwaggerOperation(Summary = "Update an existing notice", Description = "Returns a Updated notice.")]
        public async Task<ActionResult<Notice>> UpdateNotice(Guid id, [FromBody] NoticeData notice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedNotice = await _noticeService.UpdateNoticeAsync(id, notice);
                if (updatedNotice == null)
                {
                    _logger.LogError("Error updating notice {Id}", id);
                    return StatusCode(500, $"Update notice id: ${id} failed");
                }

                return Ok(updatedNotice);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating notice {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Delete a notice
        /// </summary>
        /// <param name="id">Notice ID</param>
        /// <returns>No content if successful</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [SwaggerOperation(Summary = "Delete a notice")]
        public async Task<IActionResult> DeleteNotice(Guid id)
        {
            try
            {
                var deleted = await _noticeService.DeleteNoticeAsync(id);
                if (!deleted)
                {
                    return NotFound($"Notice with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting notice {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}