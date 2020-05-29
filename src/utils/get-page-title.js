import defaultSettings from '@/settings'

const title = defaultSettings.title || '软件开发生命周期管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
