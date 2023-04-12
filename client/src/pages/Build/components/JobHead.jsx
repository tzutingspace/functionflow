const JobHead = ({ jobData }) => {
  console.log('jobHead:', jobData);
  return <div>Job Title Name: {jobData.name}</div>;
};

export default JobHead;
