const Message = ({ latestMessages, loginUser, currentUser }) => {
  const formatMessageDate = (createdAt) => {
    // If createdAt is not available or invalid, return current time
    if (!createdAt) {
      return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    // Convert to Date object, with error handling in case createdAt is not a valid date
    const parsedDate = new Date(createdAt);
    if (isNaN(parsedDate)) {
      console.warn("Invalid date format for createdAt:", createdAt);
      return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }); // Return current time if invalid
    }

    const today = new Date();

    // Check if the message was created today
    const isToday =
      parsedDate.getDate() === today.getDate() &&
      parsedDate.getMonth() === today.getMonth() &&
      parsedDate.getFullYear() === today.getFullYear();

    // If the message was created today, show time, otherwise show date
    return isToday
      ? parsedDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : parsedDate.toLocaleDateString();
  };

  return (
    <div>
      {Array.isArray(latestMessages) && latestMessages.length > 0 ? (
        latestMessages.map((msg, index) => {
          if (!msg) {
            console.warn(`Message at index ${index} is undefined`);
            return null;
          }

          const userAvatar =
            (loginUser && loginUser.id === msg.receiver_id) ||
            msg.from === "You"
              ? loginUser.profile_picture
              : currentUser?.profile_picture || "default-image.png";

          return (
            <div
              key={index}
              className={`flex mb-4 cursor-pointer ${
                loginUser &&
                (loginUser.id == msg.receiver_id || msg.from === "You")
                  ? "justify-end"
                  : ""
              }`}
            >
              <div
                className={`flex mb-2 ${
                  loginUser &&
                  (loginUser.id == msg.receiver_id || msg.from === "You")
                    ? "justify-end"
                    : ""
                } rounded-lg p-3 gap-3`}
                style={{
                  backgroundColor:
                    loginUser.id == msg.receiver_id || msg.from === "You"
                      ? "#E2F7CB" // If the message is from the logged-in user
                      : "#F2F2F2", // If the message is from someone else
                }}
              >
                <p className="text-sm mt-1">
                  {msg.message || msg.latest_messages || "No message available"}
                </p>
                <p className="text-right text-xs text-grey-dark mt-1">
                  {formatMessageDate(msg.createdAt)}
                </p>
              </div>

              <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                <img
                  src={userAvatar}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                  onError={(event) => {
                    event.target.src = "default-image.png";
                  }}
                />
              </div>
            </div>
          );
        })
      ) : (
        <div>Please Select Chat From SideBar</div>
      )}
    </div>
  );
};

export default Message;
