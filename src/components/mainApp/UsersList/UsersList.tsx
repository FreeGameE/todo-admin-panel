import { Flex } from "antd";
import UserItem from "../UserItem/UserItem";
import { MetaResponse, User } from "../../../types/users";
import Typography from "antd/es/typography/Typography";

type UsersListProps = {
  usersData: MetaResponse<User> | null;
};

const UsersList: React.FC<UsersListProps> = ({ usersData }) => {
  return (
    <Flex wrap="wrap">
      {usersData ? (
        usersData.data.map((user) => (
          <Flex key={user.id} style={{ width: "100%" }}>
            <UserItem
              id={user.id}
              username={user.username}
              email={user.email}
              date={user.date}
              isBlocked={user.isBlocked}
              roles={user.roles}
              phoneNumber={user.phoneNumber}
            />
          </Flex>
        ))
      ) : (
        <Typography>Загрузка...</Typography>
      )}
    </Flex>
  );
};

export default UsersList;
