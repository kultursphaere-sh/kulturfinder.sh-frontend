import i18n from '@/i18n'
import { ApiService } from '@/services/api_service'

let apiService

class InstitutionService {
  constructor() {
    apiService = new ApiService(i18n)
  }

  async getInstitutions() {
    return apiService.fetchInstitutions(i18n.locale)
  }

  async getInstitution(id) {
    return apiService.fetchInstitution(id, i18n.locale)
  }
}
export default new InstitutionService()
