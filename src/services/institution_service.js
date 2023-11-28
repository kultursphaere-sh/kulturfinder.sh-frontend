import i18n from '@/i18n'
import { ApiService } from '@/services/api_service'
import { ApiServiceDataport } from '@/services/api_service_dataport'

let apiService

class InstitutionService {
  constructor() {
    if (process.env.VUE_APP_NEW_API === 'true') {
      apiService = new ApiServiceDataport(i18n)
    } else {
      apiService = new ApiService(i18n)
    }
  }

  async getInstitutions() {
    return apiService.fetchInstitutions(i18n.locale)
  }

  async getInstitution(id) {
    return apiService.fetchInstitution(id, i18n.locale)
  }
}
export default new InstitutionService()
