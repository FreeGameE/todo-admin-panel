import { Button, Flex } from "antd";
import { MetaResponse, User, UserFilters } from "../../../types/users";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import "./UsersPagePagination.css";

type UsersPagePaginationProps = {
  usersData: MetaResponse<User> | null;
  userFilters: UserFilters;
  setUserFilters: React.Dispatch<React.SetStateAction<UserFilters>>;
  getVisiblePagesList: () => number[];
  loadUsersList: (filters: UserFilters) => Promise<void>;
  pageCount: number;
};

const UsersPagePagination: React.FC<UsersPagePaginationProps> = ({
  usersData,
  userFilters,
  setUserFilters,
  getVisiblePagesList,
  loadUsersList,
  pageCount,
}) => {
  const handlePageChange = async (page: number) => {
    const newUserFilters: UserFilters = {
      ...userFilters,
      offset: page - 1,
    };
    setUserFilters(newUserFilters);
    loadUsersList(newUserFilters);
  };

  const handleNextPage = async () => {
    const newUserFilters: UserFilters = {
      ...userFilters,
      offset: Number(userFilters.offset) + 1,
    };
    setUserFilters(newUserFilters);
    loadUsersList(newUserFilters);
  };

  const handlePreviousPage = async () => {
    const newUserFilters: UserFilters = {
      ...userFilters,
      offset: Number(userFilters.offset) - 1,
    };
    setUserFilters(newUserFilters);
    loadUsersList(newUserFilters);
  };

  return (
    <Flex justify="center" align="center" style={{ marginTop: "1.5rem" }}>
      {Number(userFilters.offset) + 1 !== 1 && (
        <Button
          htmlType="button"
          color="blue"
          variant="link"
          icon={<CaretLeftOutlined style={{ fontSize: "1.1rem" }} />}
          onClick={handlePreviousPage}
        />
      )}

      {getVisiblePagesList().map((page) => (
        <Button
          htmlType="button"
          color="geekblue"
          variant="link"
          className="page-number"
          style={
            Number(userFilters.offset) + 1 === page
              ? { fontWeight: "500" }
              : undefined
          }
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Button>
      ))}
      {Number(userFilters.offset) + 1 !== pageCount && (
        <Button
          htmlType="button"
          color="blue"
          variant="link"
          icon={<CaretRightOutlined style={{ fontSize: "1.1rem" }} />}
          onClick={handleNextPage}
        />
      )}
    </Flex>
  );
};

export default UsersPagePagination;
