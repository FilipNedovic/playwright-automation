class APIUtils {
  constructor (apiContext, loginPayload) {
    this.apiContext = apiContext
    this.loginPayload = loginPayload
  }

  async getToken () {
    const response = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/auth/login',
      {
        data: this.loginPayload
      }
    )
    const responseJson = await response.json()

    return responseJson.token
  }

  async createOrder (orderPayload) {
    const response = {}
    response.token = await this.getToken()

    const orderResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/order/create-order',
      {
        headers: {
          Authorization: response.token,
          'Content-Type': 'application/json'
        },
        data: orderPayload
      }
    )

    const responseJson = await orderResponse.json()
    response.orderId = responseJson.orders[0]

    return response
  }
}

module.exports = { APIUtils }
