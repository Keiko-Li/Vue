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
  MessageBox
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
  Dialog
)
// 挂载vue原型上的属性.$name(挂载引用名)=属性名(原引用属性名)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
