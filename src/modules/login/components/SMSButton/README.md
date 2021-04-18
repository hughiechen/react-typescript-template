# 获取验证码的 button

- 封装了弹框在里面，包括发送协议
- 使用注意：
  需要传入 callback： callback 必须返回 电话号码字符串，如果返回位 '', 将不会弹框，所以可以在 callback 里面做电话号码是否输入的判断
- 依赖：
  - Captcha
  - CaptchaModal
