import './PoolTimeline.scss';
import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineSeparator
} from "@material-ui/lab";

import {
    Check,
    QueryBuilder
} from '@material-ui/icons';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";

function PoolTimeline(): JSX.Element {

    const poolDetails = useSelector((state: RootState) => state.pool);
    const {pool} = poolDetails;
    const {status} = pool;

  return (
      <div className="pool-timeline-wrapper">
          <div className="pool-timeline-container">


              <div className='timeline'>
                  <Timeline align={"left"}>
                      <TimelineItem>
                          <TimelineSeparator>
                              <TimelineDot color={"primary"}>
                                  <Check fontSize={"small"}></Check>
                              </TimelineDot>
                              <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>Create pool</TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                          <TimelineSeparator>
                              <TimelineDot color={status && status.published ? "primary" : 'grey'}>
                                  {status && status.published ? <Check fontSize={"small"}></Check> : <QueryBuilder fontSize={"small"}></QueryBuilder>}
                              </TimelineDot>
                              <TimelineConnector/>
                          </TimelineSeparator>
                          <TimelineContent>Publish pool</TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                          <TimelineSeparator>
                              <TimelineDot color={status && status.published && !status.registration.pending ? "primary" : 'grey'}>
                                  {status && status.published && !status.registration.pending ? <Check fontSize={"small"}></Check> : <QueryBuilder fontSize={"small"}></QueryBuilder>}
                              </TimelineDot>
                              <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>Registration start</TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                          <TimelineSeparator>
                              <TimelineDot color={status && status.published && status.registration.completed ? "primary" : 'grey'}>
                                  {status && status.published && status.registration.completed ? <Check fontSize={"small"}></Check> : <QueryBuilder fontSize={"small"}></QueryBuilder>}
                              </TimelineDot>
                              <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>Registration end</TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                          <TimelineSeparator>
                              <TimelineDot color={status && status.published && !status.sale.pending ? "primary" : 'grey'}>
                                  {status && status.published && !status.sale.pending ? <Check fontSize={"small"}></Check> : <QueryBuilder fontSize={"small"}></QueryBuilder>}
                              </TimelineDot>
                              <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>Sale start</TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                          <TimelineSeparator>
                              <TimelineDot color={status && status.published && status.sale.completed ? "primary" : 'grey'}>
                                  {status && status.published && status.sale.completed ? <Check fontSize={"small"}></Check> : <QueryBuilder fontSize={"small"}></QueryBuilder>}
                              </TimelineDot>
                              <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>Sale end</TimelineContent>
                      </TimelineItem>

                      {((status && !status.sale.completed) || (status && status.sale.completed && status.targetReached)) ? <TimelineItem>
                          <TimelineSeparator>
                              <TimelineDot color={status && status.published && !status.claim.pending ? "primary" : 'grey'}>
                                  {status && status.published && !status.claim.pending ? <Check fontSize={"small"}></Check> : <QueryBuilder fontSize={"small"}></QueryBuilder>}
                              </TimelineDot>
                              <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>Claim start</TimelineContent>
                      </TimelineItem> : ''}


                      {((status && status.sale.completed) || (status && status.sale.completed && !status.targetReached)) ? <TimelineItem>
                          <TimelineSeparator>
                              <TimelineDot color={status && status.published && !status.withdraw.pending ? "primary" : 'grey'}>
                                  {status && status.published && !status.withdraw.pending ? <Check fontSize={"small"}></Check> : <QueryBuilder fontSize={"small"}></QueryBuilder>}
                              </TimelineDot>
                              <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>Withdraw start</TimelineContent>
                      </TimelineItem> : ''}


                      <TimelineItem>
                          <TimelineSeparator>
                              <TimelineDot  color={status && status.published && status.claim.completed ? "primary" : 'grey'}>
                                  {status && status.published && status.claim.completed ? <Check fontSize={"small"}></Check> : <QueryBuilder fontSize={"small"}></QueryBuilder>}
                              </TimelineDot>
                          </TimelineSeparator>
                          <TimelineContent>Complete</TimelineContent>
                      </TimelineItem>
                  </Timeline>
              </div>
              
              
              
              
          </div>
      </div>
  );
}

export default PoolTimeline;
