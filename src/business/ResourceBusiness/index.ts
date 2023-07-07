type listContinueResponse = {
  
}

interface IResourceBusiness {
  listContinue: (student_id: string) => Promise<>;
}

class ResourceBusiness implements IResourceBusiness {

}

export default new ResourceBusiness();