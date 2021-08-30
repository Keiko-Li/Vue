import Vue from 'vue'
import {Row, Button, Form, FormItem, Input, Message} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Row)
// 挂载vue原型上的属性.$name(挂载引用名)=属性名(原引用属性名)
Vue.prototype.$message = Message
