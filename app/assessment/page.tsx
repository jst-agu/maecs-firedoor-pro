import SiteDetails from '@/components/forms/SiteDetails';
import DoorCard from '@/components/forms/DoorCard';
import { useAssessmentStore } from '@/store/useAssessmentStore';

export default function AssessmentPage() {
  const { doors } = useAssessmentStore();

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <SiteDetails />
      
      <div className="space-y-10">
        {doors.map((door) => (
          <DoorCard key={door.id} door={door} />
        ))}
      </div>
    </div>
  );
}