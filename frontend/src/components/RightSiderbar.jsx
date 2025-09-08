import React, { useMemo } from 'react'
import { useSelector } from 'react-redux';

function RightSiderbar() {
  const { selectedUserSlice, onlineUsers } = useSelector(state => state.user);
  const { messages } = useSelector(state => state.message);
  const chatImages = useMemo(() => {
    return messages
      .filter(msg => msg.image) // Keep only messages that have an image
      .map(msg => msg.image)   // Get the image URL
      .reverse();             // Show the newest images first
  }, [messages]);

  // Don't render the component if no user is selected
  if (!selectedUserSlice) {
    return null;
  }
  return selectedUserSlice && (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUserSlice ? 'max-lg:hidden' : ''}`}>
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img src={selectedUserSlice?.image  || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full' />
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          {onlineUsers?.includes(user._id) &&
            <p className='w-2 h-2 rounded-full bg-green-500'></p>}
          {selectedUserSlice.fullName || selectedUserSlice?.name}
        </h1>
        <p className='px-10 mx-auto'>{selectedUserSlice.bio || "No bio available"}</p>
      </div>
      <hr className='border-[#ffffff50] my-4' />

      <div className='px-5 text-xs'>
        <p>Media ({chatImages.length})</p>
        <div className='mt-2 max-h-[60%] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {chatImages.length > 0 ? (
            chatImages.map((url, index) => (
              <div key={index} onClick={() => window.open(url, '_blank')} className='cursor-pointer rounded aspect-square'>
                <img src={url} alt={`Chat media ${index + 1}`} className='h-full w-full object-cover rounded-md' />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-2 mt-4">No media shared yet.</p>
          )}
        </div>
      </div>

    </div>
  )
}

export default RightSiderbar