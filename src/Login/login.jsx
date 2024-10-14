import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { server } from "../main";

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${server}/auth/login`, values);
      const { token, user } = response.data;

      localStorage.setItem("authToken", token);

      const roleResponse = await axios.get(`${server}/roles/${user.role}`);
      const userWithRole = { ...user, role: roleResponse.data };

      onLogin(userWithRole);

      message.success("Login successful!");
      // navigate("/dashboard");
      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      message.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Welcome to <span className="text-blue-600">Task Manager</span>
        </h1>

        <Form
          onFinish={handleLogin}
          layout="vertical"
          className="mt-8 space-y-6"
        >
          <div className="rounded-md shadow-sm space-y-2">
            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                required
                placeholder="abc@gmail.com"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                required
                placeholder="**********"
                className="mt-1  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </Form.Item>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm">
              <Link
                to="/forgetpassword"
                className="font-medium text-blue-600 hover:text-gray-500"
              >
                Forget Password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
