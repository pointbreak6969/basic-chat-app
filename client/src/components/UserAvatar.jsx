import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar"
function UserAvatar({ profilePicture, fullName }) {
    return (
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={profilePicture} />
          <AvatarFallback>
            {fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      );
  }
  
  export default UserAvatar
  