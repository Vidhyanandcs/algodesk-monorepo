import './FundTimeline.scss';
import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineSeparator
} from "@material-ui/lab";

import {CheckCircle} from '@material-ui/icons';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";

function FundTimeline(): JSX.Element {

    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;
    const {status} = fund;

  return (
      <div className="fund-timeline-wrapper">
          <div className="fund-timeline-container">


              <div className='timeline'>
                  <Timeline align={"alternate"}>
                      <TimelineItem>
                          <TimelineSeparator>
                              <TimelineDot variant={"outlined"}>
                                  <CheckCircle color={"primary"} fontSize={"small"}></CheckCircle>
                              </TimelineDot>
                              <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>Deploy</TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                          <TimelineSeparator>
                              <TimelineDot variant={"outlined"}>
                                  {/*{status.published ? <CheckCircle color={"primary"} fontSize={"small"}></CheckCircle> : ''}*/}
                              </TimelineDot>
                              <TimelineConnector/>
                          </TimelineSeparator>
                          <TimelineContent>Publish</TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                          <TimelineSeparator>
                              <TimelineDot variant={"outlined"}>
                                  {status && !status.registration.pending ? <CheckCircle color={"primary"} fontSize={"small"}></CheckCircle> : ''}
                              </TimelineDot>
                              <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>Reg start</TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                          <TimelineSeparator>
                              <TimelineDot variant={"outlined"}>
                                  {status && status.registration.completed ? <CheckCircle color={"primary"} fontSize={"small"}></CheckCircle> : ''}
                              </TimelineDot>
                              <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>Reg end</TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                          <TimelineSeparator>
                              <TimelineDot variant={"outlined"}>
                                  {status && !status.sale.pending ? <CheckCircle color={"primary"} fontSize={"small"}></CheckCircle> : ''}
                              </TimelineDot>
                              <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>Sale start</TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                          <TimelineSeparator>
                              <TimelineDot variant={"outlined"}>
                                  {status && status.sale.completed ? <CheckCircle color={"primary"} fontSize={"small"}></CheckCircle> : ''}
                              </TimelineDot>
                              <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>Sale end</TimelineContent>
                      </TimelineItem>

                      <TimelineItem>
                          <TimelineSeparator>
                              <TimelineDot variant={"outlined"}>
                                  {status && !status.claim.pending ? <CheckCircle color={"primary"} fontSize={"small"}></CheckCircle> : ''}
                              </TimelineDot>
                              <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>Claim start</TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                          <TimelineSeparator>
                              <TimelineDot variant={"outlined"}>
                                  {status && status.claim.completed ? <CheckCircle color={"primary"} fontSize={"small"}></CheckCircle> : ''}
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

export default FundTimeline;
