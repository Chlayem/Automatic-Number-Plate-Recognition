using Microsoft.AspNetCore.SignalR;


namespace anprAPI.Hubs
{
    public class StreamHub : Hub
    {
        public Task Subscribe(string cameraId)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, cameraId);
        }
        public Task UnSubscribe(string cameraId)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, cameraId);
        }
        public async Task FrameReady(string cameraId)
        {
            await Clients.Group(cameraId).SendAsync("FrameReady", cameraId);
        }

    }

}
