import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Button,
  Form,
  Input,
  Typography,
  Select,
  ConfigProvider,
  Row,
} from 'antd';
import { LockOutlined } from '@ant-design/icons';
import styles from './LandingCleanerStyles.module.css';
import { authReducer } from '../../redux/authSlice';
import CleanerFooter from '../../components/CleanerFooter/CleanerFooter';
import { Link } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

interface ErrStatus {
  status: boolean;
  message: string;
}

const CleanerLogin: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [err, setErr] = useState<ErrStatus>({ status: false, message: '' });

  const onFinishStatus = (err: boolean, errorInfo: string): void => {
    setErr({ status: err, message: errorInfo });
    setTimeout(() => {
      setErr({ status: false, message: '' });
    }, 3000);
  };

  const prefixSelector = (
    <Form.Item
      name="prefix"
      noStyle
      rules={[{ required: true, message: 'Выберите префикс!' }]}
    >
      <Select
        style={{
          width: 100,
          backgroundColor: 'white',
          borderRadius: '5px 0px 0px 5px',
        }}
      >
        <Option value="+998">+998</Option>
        <Option value="+996">+996</Option>
        <Option value="+992">+992</Option>
        <Option value="+7">+7</Option>
      </Select>
    </Form.Item>
  );

  const onFinish = async (values: {
    prefix: string;
    phone: string;
    password: string;
  }): Promise<void> => {
    const phoneNumber = values.prefix + values.phone;

    const res = await fetch(import.meta.env.VITE_URL + 'cleaner/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password: values.password, phoneNumber }),
    });

    if (res.ok) {
      const result = await res.json();
      dispatch(
        authReducer({
          type: 'cleaner',
          name: result.name,
          id: result.id,
          email: '',
          img: result.img,
          phoneNumber: result.phoneNumber,
        })
      );

      navigate('/cleaner');
    } else if (res.status === 403) {
      onFinishStatus(true, 'Неверно указан номер телефона или пароль');
    } else {
      onFinishStatus(true, 'Произошла ошибка, попробуйте позже');
    }
  };

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: 'black',
            fontSize: 18,
            colorLink: 'black',
            colorLinkActive: 'black',
            colorLinkHover: 'gray',
          },
        }}
      >
        <div className={styles.cleanerHeaderDiv}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16, offset: 3 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            {!err.status && (
              <Form.Item validateStatus="error" help={err.message} />
            )}
            <Title>Авторизация сотрудника</Title>

            <Form.Item
              name="phone"
              rules={[
                {
                  required: true,
                  message: 'Введите номер телефона! ',
                },
              ]}
            >
              <Input
                placeholder="Введите номер телефона"
                addonBefore={prefixSelector}
                style={{ width: 450 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Вы забыли ввести пароль!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Введите пароль"
                style={{ width: 450 }}
              />
            </Form.Item>

            <Row style={{ marginLeft: '13%' }}>
              <Link style={{ marginTop: '6px' }} to="/jobs">
                Еще не стали клинером?
              </Link>
              <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
                <Button type="primary" htmlType="submit" size="large">
                  Войти в аккаунт
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </div>
      </ConfigProvider>
      <CleanerFooter />
    </>
  );
};

export default CleanerLogin;