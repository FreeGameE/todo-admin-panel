import { Flex, Form, Input, Typography } from "antd";
import { MetaResponse, User, UserFilters } from "../../../types/users";
import { relative } from "path";

type UsersPageSearchProps = {
  usersData: MetaResponse<User> | null;
  userFilters: UserFilters;
  setUserFilters: React.Dispatch<React.SetStateAction<UserFilters>>;
  loadUsersList: (filters: UserFilters) => Promise<void>;
  isUsersFound: boolean;
};

const UsersPageSearch: React.FC<UsersPageSearchProps> = ({
  usersData,
  userFilters,
  setUserFilters,
  loadUsersList,
  isUsersFound,
}) => {
  const handleSearch = async (values: string) => {
    const newUserFilters: UserFilters = {
      ...userFilters,
      search: values,
    };
    setUserFilters(newUserFilters);
    loadUsersList(newUserFilters);
  };
  return (
    <Flex vertical align="center" style={{ marginBottom: "0rem" }}>
      <Form style={{textAlign: "center"}}> 
        <Form.Item 
          name="search"
          rules={[
            { required: true, message: "Введите имя пользователя" },
            {
              max: 60,
              message: "Имя пользователя должно содержать не более 60 символов",
            },
            {
              pattern: /^[a-zA-Zа-яА-Я]{1,999}$/,
              message: "Допустимы только буквы русского и латинского алфавитов",
            },
          ]}
        >
          <Input.Search style={{ width: "15rem" }} onSearch={handleSearch} placeholder="Имя или почта" />
        </Form.Item>
      </Form>

      {!isUsersFound ? (
        <Typography>Пользователь не найден</Typography>
      ) : undefined}
    </Flex>
  );
};

export default UsersPageSearch;
