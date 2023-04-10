import * as config from '../assets/config/data.json'

const get_bullet = (id) => config.bullet.find((b) => b.id === id)
const get_turret = (id) => config.turret.find((t) => t.id === id)
const get_turrets = () => config.turret

export {get_bullet, get_turret, get_turrets};
