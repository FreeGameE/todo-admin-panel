import { Button, Flex, Typography } from "antd";
import { MetaResponse, User, UserFilters } from "../../../types/users";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";

type UsersPagePaginationProps = {
  usersData: MetaResponse<User> | null;
  userFilters: UserFilters;
};

const UsersPagePagination: React.FC<UsersPagePaginationProps> = ({
  usersData,
  userFilters,
}) => {
  return (
    <Flex justify="center" align="center" style={{ marginTop: "1.5rem" }}>
      <Button
        htmlType="button"
        color="blue"
        variant="link"
        icon={<CaretLeftOutlined style={{ fontSize: "1.5rem" }} />}
      />
      <Typography style={{ fontSize: "14px", lineHeight: "1rem" }}>
        {Number(userFilters.offset) + 1}
      </Typography>

      {Number(usersData?.meta.totalAmount) > 20 && (
        <Button
          htmlType="button"
          color="default"
          variant="link"
          style={{
            height: "1rem",
            fontSize: "14px",
            lineHeight: "1rem",
            padding: 0,
            margin: 0,
          }}
        >
          1
        </Button>
      )}
      <Button
        htmlType="button"
        color="blue"
        variant="link"
        icon={<CaretRightOutlined style={{ fontSize: "1.5rem" }} />}
      />
    </Flex>
  );
};

export default UsersPagePagination;
