import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  pageName: string;
  addButtonLink?: string
}
const Breadcrumb = ({ pageName, addButtonLink }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-title-md2 font-semibold text-black dark:text-white inline mr-5">
          {pageName}
        </h2>
        {
          addButtonLink &&    
          <Link to={addButtonLink}>
            <button className='bg-primary rounded-md py-1 px-7 text-white'>Add</button>
          </Link>
        }
      </div>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" to="/">
              Dashboard /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
