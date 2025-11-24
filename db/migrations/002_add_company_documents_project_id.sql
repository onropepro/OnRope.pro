-- Add project_id column to company_documents table
ALTER TABLE company_documents 
ADD COLUMN project_id varchar;

-- Add foreign key constraint with ON DELETE SET NULL
ALTER TABLE company_documents 
ADD CONSTRAINT company_documents_project_id_fk 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;

-- Add index for project_id
CREATE INDEX IF NOT EXISTS IDX_company_docs_project ON company_documents(project_id);
