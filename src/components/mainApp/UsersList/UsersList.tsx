import { Flex } from "antd";
import UserItem from "../UserItem/UserItem";
import { MetaResponse, User, UserFilters } from "../../../types/users";
import Typography from "antd/es/typography/Typography";

type UsersListProps = {
  usersData: MetaResponse<User> | null;
  loadUsersList: (filters: UserFilters) => Promise<void>;
  userFilters: UserFilters;
};

const UsersList: React.FC<UsersListProps> = ({ usersData, loadUsersList,userFilters }) => {
  return (
    <Flex wrap="wrap">
      {usersData ? (
        usersData.data.map((user) => (
          <Flex key={user.id} style={{ width: "100%" }}>
            <UserItem
              user={user}
              loadUsersList={loadUsersList}
              userFilters={userFilters}
              // id={user.id}
              // username={user.username}
              // email={user.email}
              // date={user.date}
              // isBlocked={user.isBlocked}
              // roles={user.roles}
              // phoneNumber={user.phoneNumber}
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
