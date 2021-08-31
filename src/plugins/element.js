import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Row,
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
  Card
} from 'element-ui'

Vue.use(
  Button,
  Form,
  FormItem,
  Input,
  Row,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card
)
// 挂载vue原型上的属性.$name(挂载引用名)=属性名(原引用属性名)
Vue.prototype.$message = Message
