import { Flex, Typography } from "antd";
import { User } from "../../../types/users";
import "./UserItem.css";

const UserItem: React.FC<User> = ({
  id,
  username,
  email,
  date,
  isBlocked,
  roles,
  phoneNumber,
}) => {
  return (
    <Flex
      style={{
        borderBottom: "1px solid #ccc",
        width: "100%",
      }}
    >
      <Typography className="table-row">{username}</Typography>
      <Typography className="table-row">{email}</Typography>
      <Typography className="table-row">
        {new Date(date).toLocaleString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Typography>
      {isBlocked ? (
        <Typography className="table-row">Забанен</Typography>
      ) : (
        <Typography className="table-row">Не забанен</Typography>
      )}

      <Flex className="table-row">
        <Typography>{roles.join(", ")}</Typography>
      </Flex>
      <Typography className="table-row">{phoneNumber}</Typography>
    </Flex>
  );
};
export default UserItem;
