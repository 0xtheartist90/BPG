import { getEventGroups } from '../../actions/events';
import { EventList } from './event-list';

export default async function AdminAgendaPage() {
    const result = await getEventGroups();

    if (!result.success) {
        return (
            <div>
                <h1 className='mb-4 text-2xl font-bold text-gray-900'>Agenda</h1>
                <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
                    <p className='text-red-700'>{result.error}</p>
                </div>
            </div>
        );
    }

    return <EventList events={result.data} />;
}
