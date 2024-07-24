using Microsoft.AspNetCore.SignalR;

namespace anprAPI.Hubs
{
    public class DetectionHub : Hub
    {
        public Task Subscribe(string detectorId)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, detectorId);
        }
        public Task UnSubscribe(string detectorId)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, detectorId);
        }
        public async Task DetectedFrameReady(string detectorId)
        {
            await Clients.Group(detectorId).SendAsync("detectedFrameReady", detectorId);
        }
    }
}
