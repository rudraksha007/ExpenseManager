import '../css/NewProject.css';

function NewProject() {
    return (
        <div id="newProjectDiv">
            <label>
                Project Title:
            </label>
                <input type="text" name="projectTitle" placeholder="Enter project title" />

            <label>
                Project No:
            </label>
                <input type="text" name="projectNo" placeholder="Enter project number" />

            <label>
                Project Start Date:
            </label>
                <input type="date" name="projectStartDate" placeholder="Enter start date" />

            <label>
                Project End Date:
            </label>
                <input type="date" name="projectEndDate" placeholder="Enter end date" />

            <label>
                Sanction Order No:
            </label>
                <input type="text" name="sanctionOrderNo" placeholder="Enter sanction order number" />

            <label>
                Total Sanction amount:
            </label>
                <input type="number" name="totalSanctionAmount" placeholder="Enter total sanction amount" />

            <label>
                PI name:
            </label>
                <input type="text" name="piName" placeholder="Enter PI name" />

            <label>
                CoPIs:
            </label>
                <input type="text" name="coPIs" placeholder="Enter CoPIs" />

            <label>
                Manpower Allocation Amt:
            </label>
                <input type="number" name="manpowerAllocationAmt" placeholder="Enter manpower allocation amount" />

            <label>
                Consumables Allocation Amt:
            </label>
                <input type="number" name="consumablesAllocationAmt" placeholder="Enter consumables allocation amount" />

            <label>
                Contingency Allocation Amt:
            </label>
                <input type="number" name="contingencyAllocationAmt" placeholder="Enter contingency allocation amount" />

            <label>
                Overhead Allocation Amt:
            </label>
                <input type="number" name="overheadAllocationAmt" placeholder="Enter overhead allocation amount" />

            <label>
                Equipment Allocation Amt:
            </label>
                <input type="number" name="equipmentAllocationAmt" placeholder="Enter equipment allocation amount" />

            <label>
                Travel Allocation Amt:
            </label>
                <input type="number" name="travelAllocationAmt" placeholder="Enter travel allocation amount" />
        </div>
    )
}

export default NewProject;