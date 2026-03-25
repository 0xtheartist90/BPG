import { getArticleGroups } from '../../actions/articles';
import { ArticleList } from './article-list';

export default async function AdminNewsPage() {
    const result = await getArticleGroups();

    if (!result.success) {
        return (
            <div>
                <h1 className='mb-4 text-2xl font-bold text-gray-900'>Nieuwsartikelen</h1>
                <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
                    <p className='text-red-700'>{result.error}</p>
                </div>
            </div>
        );
    }

    return <ArticleList articles={result.data} />;
}
