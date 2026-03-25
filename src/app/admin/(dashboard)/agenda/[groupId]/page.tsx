import { getEventByGroupId } from '../../../actions/events';
import { EventForm } from '../event-form';

export default async function EditEventPage({ params }: { params: Promise<{ groupId: string }> }) {
    const { groupId } = await params;
    const result = await getEventByGroupId(groupId);

    if (!result.success) {
        return (
            <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
                <p className='text-red-700'>{result.error}</p>
            </div>
        );
    }

    return <EventForm event={result.data} />;
}
