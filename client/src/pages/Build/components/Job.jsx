import JobTitle from './JobTitle';
import Tool from './Tool';

const Job = ({ idx, jobData, jobsData, setJobsData }) => {
  return (
    <>
      <div>
        {idx ? <JobTitle jobData={jobData} setJobsData={setJobsData}></JobTitle> : <>Trigger</>}
      </div>
      <Tool idx={idx} jobData={jobData} jobsData={jobsData} setJobsData={setJobsData} />
    </>
  );
};

export default Job;
