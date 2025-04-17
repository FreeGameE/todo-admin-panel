import { postData } from "../../../api/todosApi";
import { Button, Input, Form } from "antd";
import { Status } from "../../../types/todos";
import "./AddTodo.css";

type addTodoProps = {
  filteredTodoStatus: Status;
  loadTodoList: () => Promise<void>;
};

const AddTodo: React.FC<addTodoProps> = ({
  filteredTodoStatus,
  loadTodoList,
}) => {
  const [form] = Form.useForm();

  const minTaskLength = 2;
  const maxTaskLength = 64;

  const addingTodo = async (formData: FormData) => {
    const title = formData.get("title") as string;
    try {
      await postData({ title: title.trim() });
      loadTodoList();
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
    }
  };

  const handleFinish = (values: { title: string }) => {
    const formData = new FormData();
    formData.append("title", values.title);
    addingTodo(formData);
    form.resetFields();
  };

  return (
    <Form
      style={{ marginTop: "1rem" }}
      form={form}
      className="add-todo"
      onFinish={handleFinish}
    >
      <Form.Item
        name="title"
        rules={[
          { required: true, message: "Введите текст задачи" },
          {
            min: minTaskLength,
            message: "Текст задачи должен содержать минимум 2 символа",
          },
          {
            max: maxTaskLength,
            message: "Текст задачи должен содержать максимум 64 символа",
          },
        ]}
        style={{ marginBottom: "0", width: "12rem" }}
      >
        <Input
          placeholder="Ваша задача"
        />
      </Form.Item>

      <Form.Item>
        <Button
          style={{
            paddingInline: "2rem",
            paddingBlock: "1.1rem",
            marginBottom: "0",
          }}
          type="primary"
          htmlType="submit"
        >
          Добавить
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddTodo;
