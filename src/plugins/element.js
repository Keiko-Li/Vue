/* eslint-disable no-undef */
import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Header,
  Container,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Col,
  Row,
  Table,
  TableColumn,
  Dialog,
  MessageBox,
  Tree,
  Select,
  Option,
  Cascader,
  Alert
} from 'element-ui'

Vue.use(
  Button,
  Form,
  FormItem,
  Input,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Col,
  Row,
  Table,
  TableColumn,
  Dialog,
  Tree,
  Select,
  Option,
  Cascader,
  Alert
)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
