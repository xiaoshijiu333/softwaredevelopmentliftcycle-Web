const getters = {
    token: state => state.user.token,
    name: state => state.user.name,
    phone: state => state.user.phone,
    headphoto: state => state.user.headphoto,
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    roles: state => state.user.roles,
    permission_routes: state => state.permission.routes
}
export default getters
