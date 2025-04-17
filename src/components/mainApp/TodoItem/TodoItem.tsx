import React, { useState } from "react";
import { Button, Checkbox, Col, Flex, Form, Input, message, Typography } from "antd";
import { changeData, deleteData } from "../../../api/todosApi";
import { Todo } from "../../../types/todos";
import "./TodoItem.css";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  FormOutlined,
} from "@ant-design/icons";

type TodoItemProps = {
  todo: Todo;
  loadTodoList: () => Promise<void>;
};

const TodoItem: React.FC<TodoItemProps> = React.memo(
  ({ todo, loadTodoList }) => {
    const [editingStatus, setEditingStatus] = useState<boolean>(false);
    const [form] = Form.useForm();

    const minTaskLength = 2;
    const maxTaskLength = 64;
    
    const handleChangeStatus = async () => {
      try {
        await changeData(todo.id, {
          isDone: !todo.isDone,
        });
        loadTodoList();
      } catch (error) {
        console.error("Ошибка при отправке данных:", error);
      }
    };

    const handleEditClick = () => {
      loadTodoList();
      form.setFieldsValue({ title: todo.title });
      setEditingStatus(true);
    };

    const handleSubmitEdit = async (values: { title: string }) => {
      const trimmedTitle = values.title.trim();
      if (
        trimmedTitle.length >= minTaskLength &&
        trimmedTitle.length <= maxTaskLength
      ) {
        try {
          await changeData(todo.id, { title: trimmedTitle });
          loadTodoList();
          setEditingStatus(false);
        } catch (error) {
          console.error("Ошибка при отправке данных:", error);
        }
      } else {
        message.error("Текст должен быть от 2 до 64 символов");
      }
    };

    const handleDeleteClick = async () => {
      try {
        await deleteData(todo.id);
        loadTodoList();
      } catch (error) {
        console.error("Ошибка при отправке данных:", error);
      }
    };

    return (
      <>
        <Flex className="todo-item">
          <Col className="todo-left-side">
            <Checkbox
              checked={todo?.isDone}
              onChange={handleChangeStatus}
              className="todo-checkbox"
              style={{ marginRight: "0.5rem" }}
            />
            {editingStatus ? (
              <>
                <Form
                  id={`change${todo.id}`}
                  form={form}
                  onFinish={handleSubmitEdit}
                  initialValues={{ title: todo.title }}
                >
                  <Form.Item
                    initialValue={todo?.title}
                    name="title"
                    rules={[
                      { required: true, message: "Введите текст задачи" },
                      {
                        min: minTaskLength,
                        message:
                          "Текст задачи должен содержать минимум 2 символа",
                      },
                      {
                        max: maxTaskLength,
                        message:
                          "Текст задачи должен содержать максимум 64 символа",
                      },
                    ]}
                    style={{ marginBottom: "0", width: "12rem" }}
                  >
                    <Input.TextArea
                      rows={5}
                      style={{
                        resize: "none",
                        margin: "16px 0px",
                      }}
                    />
                  </Form.Item>
                </Form>
              </>
            ) : (
              <Typography.Text
                className="todo-item-p"
                delete={todo.isDone}
                type={todo.isDone ? "secondary" : undefined}
                key={todo.isDone ? "done" : "not-done"}
              >
                {todo?.title}
              </Typography.Text>
            )}
          </Col>
          <Col className="todo-right-side" style={{display: "flex", gap: "0.3rem"}}>
            {editingStatus ? (
              <>
                {/* //* кнопка отменить изменения */}
                <Button
                  className="cancel-Button"
                  onClick={() => setEditingStatus(false)}
                  icon={<CloseOutlined />}
                  color="orange"
                  variant="solid"
                />
                {/* кнопка принять изменения */}
                <Button
                  form={`change${todo.id}`}
                  className="accept-Button"
                  htmlType="submit"
                  icon={<CheckOutlined />}
                  color="green"
                  variant="solid"
                />
              </>
            ) : (
              
                // {/* //$ кнопка редактировать */}
                <Button
                  className="edit-Button"
                  onClick={handleEditClick}
                  icon={<FormOutlined />}
                  color="primary"
                  variant="solid"
                />
              
            )}
            {/* //@ кнопка удалить todo */}
            <Button
              onClick={() => {
                handleDeleteClick();
              }}
              disabled={editingStatus}
              icon={<DeleteOutlined />}
              color="danger"
              variant="solid"
            />
          </Col>
        </Flex>
      </>
    );
  }
);

export default TodoItem;
