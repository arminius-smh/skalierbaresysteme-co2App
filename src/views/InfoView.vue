<template>
  <div class="container">
    <h1 class="text-center my-4">Frequently Asked Questions</h1>

    <div class="accordion" id="accordionExample">
      <!-- Question 1 -->
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            Where do we get out Map Data from?
          </button>
        </h2>

        <div
          id="collapseOne"
          class="accordion-collapse collapse"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            Our data is feched from the
            <a href="https://carbonintensity.org.uk/">Carbon Intensity API</a>
          </div>
        </div>
      </div>

      <!-- Question 2 -->
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingTwo">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTwo"
            aria-expanded="false"
            aria-controls="collapseTwo"
          >
            How does the CO2 calculation for a datacenter work?
          </button>
        </h2>
        <div
          id="collapseTwo"
          class="accordion-collapse collapse"
          aria-labelledby="headingTwo"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            The carbon intensity for the specific region is fetched in gCO2/kWh
            (and then converted to kgCO2/kWh). The individual power consumption
            of a single computer is based on the
            <a
              href="https://eta-publications.lbl.gov/sites/default/files/lbnl-1005775_v2.pdf"
              >United States Data Center Energy Usage Report</a
            >
            which distinguishes between servers that contain one processor
            socket ("1S") and those that contain 2 or more ("2S+"). For our
            application, we have chosen to only calculate based on 1S servers.
            The average load of the servers used in the study was 50%.<br />
            <br />
            The maximum power consumption of a 1S server was estimated from the
            SERT database to be 118W (or 0.118kW).<br />
            SERT was created by SPEC for the US Environmental Protection
            Agency's (EPA) ENERGY STAR program. This tool uses a set of
            synthetic worklets to test discrete system components, providing
            detailed power use data at different load levels. <br />
            <br />
            Which leads to the following formula to calculate co2 emission per
            day: <br />
            co2 Intensity * (maxPowerPC * average load * time) <br />
            <br />
            example calculation for one server per day: <br />
            0.100 kgCO2 / kWh * (0.118kW * 0.5 * 24h) = 0.142 kgCO2
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
