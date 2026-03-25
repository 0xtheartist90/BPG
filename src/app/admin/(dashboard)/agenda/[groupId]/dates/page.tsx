import { getEventInstances } from '../../../../actions/events';
import { InstanceList } from './instance-list';

export default async function EventDatesPage({ params }: { params: Promise<{ groupId: string }> }) {
    const { groupId } = await params;
    const result = await getEventInstances(groupId);

    if (!result.success) {
        return (
            <div className='rounded-xl border border-red-200 bg-red-50 p-4'>
                <p className='text-red-700'>{result.error}</p>
            </div>
        );
    }

    return <InstanceList template={result.data.template} instances={result.data.instances} />;
}
