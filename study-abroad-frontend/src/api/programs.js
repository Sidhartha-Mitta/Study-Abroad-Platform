import { universityAPI } from './universities'

export const programAPI = {
  getAll: (params) => universityAPI.getPrograms(params),
}
